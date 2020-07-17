const express = require("express");
const bcrypt = require("bcryptjs");
//const jwt = require("jsonwebtoken");
const Users = require("./users-model");
// const restrict = require("../middleware/restrict");
// const jwtDecode = require("jwt-decode");

const router = express.Router();

router.post("/register", async (req, res, next) => {
    try {
        const { username, password } = req.body;
        const user = await Users.findBy({ username }).first();

        if (user) {
            return res.status(409).json({
                message: "Username is already taken",
            });
        }

        const newUser = await Users.add({
            username,
            // hash the password with a time complexity of "14"
            password: await bcrypt.hash(password, 14),
        });

        res.status(201).json(newUser);
    } catch (err) {
        next(err);
    }
});

router.delete("/:id", (req, res) => {
    const { id } = req.params;

    Users.remove(id)
        .then((deleted) => {
            if (deleted) {
                res.json({ removed: deleted });
            } else {
                res.status(404).json({
                    message: "Could not find user with given id",
                });
            }
        })
        .catch((err) => {
            res.status(500).json({ message: "Failed to delete user" });
        });
});

module.exports = router;
