import { Router, Request, Response } from "express";
import Estudiante from "../classes/estudiante";

const router = Router();

router.get("/estudiantes", async (req: Request, res: Response) => {
    try {
        const estudiantes = await Estudiante.obtenerTodos();
        res.json(estudiantes);
    } catch (error) {
        res.status(500).json({ error: "Error al obtener los estudiantes" });
    }
});

export default router;
