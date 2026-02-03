const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { User } = require("../models");

// REGISTRO
exports.register = async (req, res) => {
  try {
    const { name, password, confirmPassword, role } = req.body;

    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Las contraseñas no coinciden" });
    }

    const userExists = await User.findOne({ where: { name } });
    if (userExists) {
      return res.status(400).json({ message: "El usuario ya existe" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await User.create({
      name,
      password: hashedPassword,
      role,
    });

    res.status(201).json({ message: "Usuario creado correctamente" });
  } catch (error) {
    res.status(500).json({ message: "Error al registrar usuario", error });
  }
};

// LOGIN
exports.login = async (req, res) => {
  try {
    const { name, password } = req.body;

    const user = await User.findOne({ where: { name } });
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return res.status(401).json({ message: "Credenciales inválidas" });
    }

    const token = jwt.sign(
      {
        id: user.id,
        role: user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    // Enviar token y datos del usuario (sin contraseña) para que el frontend los guarde
    res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Error al iniciar sesión", error });
  }
};

// Devuelve datos del usuario actual usando el token
exports.me = async (req, res) => {
  try {
    const { id } = req.user;
    const user = await User.findByPk(id, {
      attributes: ["id", "name", "role"],
    });
    if (!user) return res.status(404).json({ message: "Usuario no encontrado" });
    res.json({ user });
  } catch (error) {
    res.status(500).json({ message: "Error al obtener usuario", error });
  }
};
