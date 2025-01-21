import { Router, Request, Response } from 'express';
import Estudiante from '../classes/estudiante';

const router = Router();
const estudiante = new Estudiante();

router.post('/estudiante/create', (req: Request, res: Response) => {
    let datos = { ...req.body };
    estudiante.insertEstudiante(datos).then((result: any) => {
        res.status(200).json({
            'success': true,
            'result': result
        });
    }).catch((err: any) => {
        res.status(500).json({
            'success': false,
            'result': err
        });
    });
});

router.get('/estudiante/:id', (req: Request, res: Response) => {
    let id = req.params.id;
    estudiante.getEstudiante(id).then((result: any) => {
        res.status(200).json(result);
    }).catch((err: any) => {
        res.status(500).json({
            'success': false,
            'result': err
        });
    });
});

router.put('/estudiante/update/:id', (req: Request, res: Response) => {
    let id = req.params.id;
    let datos = { ...req.body };
    estudiante.updateEstudiante(id, datos).then((result: any) => {
        res.status(200).json({
            'success': true,
            'result': result
        });
    }).catch((err: any) => {
        res.status(500).json({
            'success': false,
            'result': err
        });
    });
});

export default router;
