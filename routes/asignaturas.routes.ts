import { Router, Request, Response } from 'express';
import Asignatura from '../classes/asignaturas';

const router = Router();
const asignatura = new Asignatura();

router.post('/asignatura/create', (req: Request, res: Response) => {
    let datos = { ...req.body };
    asignatura.insertAsignatura(datos).then((result: any) => {
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

router.get('/asignatura/:id', (req: Request, res: Response) => {
    let id = req.params.id;
    asignatura.getAsignatura(id).then((result: any) => {
        res.status(200).json(result);
    }).catch((err: any) => {
        res.status(500).json({
            'success': false,
            'result': err
        });
    });
});

router.put('/asignatura/update/:id', (req: Request, res: Response) => {
    let id = req.params.id;
    let datos = { ...req.body };
    asignatura.updateAsignatura(id, datos).then((result: any) => {
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
