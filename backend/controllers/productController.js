import { sql } from "../config/db.js";

// get products function
export const getProducts = async (req, res) => {
    try {
        const products = await sql`
        SELECT * FROM products
        ORDER BY created_at DESC
        `;

        console.log(products);
        res.status(200).json({success:200, data: products})
    } catch (error) {
        console.log("Error in getProducts function", error);
        res.status(500).json({ success: false, message:"Internal Server Error" });
    }
};

// create products function
export const createProduct = async (req, res) => {
    const {name,price,image} = req.body;
    
    if(!name || !price || !image){
        return res.status(400).json({success:false, message:"All fields are required"})
    }

    try {
        const newProduct = await sql`
            INSERT INTO products (name,price,image)
            VALUES (${name},${price},${image})
            RETURNING *
        `;

        console.log("New product added: ", newProduct);
        res.status(201).json({ success: true, data: newProduct[0] });

    } catch (error) {
        console.log("Error in createProduct function", error);
        res.status(500).json({ success: false, message:"Internal Server Error" });
    }
};

// get product (singular) function
export const getProduct = async (req, res) => {
    const { id }=req.params;

    try {
        const product = await sql`
            SELECT * FROM products WHERE id=${id}
        `;

        console.log("Product selected: ", product);
        res.status(200).json({ success: true, data: product[0] });
    } catch (error) {
        console.log("Error in getProduct function", error);
        res.status(500).json({ success: false, message:"Internal Server Error" });
    }
};

// update products function
export const updateProduct = async (req, res) => {
    const { id }=req.params;
    const { name,price,image } = req.body;

    try {
        const updateProduct = await sql`
            UPDATE products
            SET name=${name}, price=${price}, image=${image}
            WHERE id=${id}
            RETURNING *
        `;

        if(updateProduct.length === 0){
            return res.status(404).json({
                success: false,
                message: "Product not found",
            });
        }

        console.log("Product updated: ", updateProduct);
        res.status(200).json({ success: true, data: updateProduct[0] });
    } catch (error) {
        console.log("Error in updateProduct function", error);
        res.status(500).json({ success: false, message:"Internal Server Error" });
    }
};

// delete products function
export const deleteProduct = async (req, res) => {
    const { id } = req.params;

    try {
        const deletedProduct = await sql`
            DELETE FROM products WHERE id=${id} RETURNING *
        `;

        if(deletedProduct.length === 0){
            return res.status(404).json({
                success: false,
                message: "Product not found",
            });
        }

        console.log("Product updated: ", deletedProduct);
        res.status(200).json({ success: true, data: deletedProduct[0] });
    } catch (error) {
        console.log("Error in deleteProduct function", error);
        res.status(500).json({ success: false, message:"Internal Server Error" });
    }
};

