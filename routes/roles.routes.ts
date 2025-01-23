import { Router, Request, Response } from 'express';
import Rol from '../classes/roles';

const router = Router();
const rol = new Rol();

router.post('/rol/create', (req: Request, res: Response) => {
    let datos = { ...req.body };
    rol.insertRol(datos).then((result: any) => {
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

router.get('/rol/:id', (req: Request, res: Response) => {
    let id = req.params.id;
    rol.getRol(id).then((result: any) => {
        res.status(200).json(result);
    }).catch((err: any) => {
        res.status(500).json({
            'success': false,
            'result': err
        });
    });
});

router.put('/rol/update/:id', (req: Request, res: Response) => {
    let id = req.params.id;
    let datos = { ...req.body };
    rol.updateRol(id, datos).then((result: any) => {
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
