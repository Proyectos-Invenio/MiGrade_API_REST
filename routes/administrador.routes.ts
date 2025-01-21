import { Router, Request, Response } from 'express';
import Administrador from '../classes/administrador';

const router = Router();
const administrador = new Administrador();

router.post('/administrador/create', (req: Request, res: Response) => {
    let datos = { ...req.body };
    administrador.insertAdministrador(datos).then((result: any) => {
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

router.get('/administrador/:id', (req: Request, res: Response) => {
    let id = req.params.id;
    administrador.getAdministrador(id).then((result: any) => {
        res.status(200).json(result);
    }).catch((err: any) => {
        res.status(500).json({
            'success': false,
            'result': err
        });
    });
});

router.put('/administrador/update/:id', (req: Request, res: Response) => {
    let id = req.params.id;
    let datos = { ...req.body };
    administrador.updateAdministrador(id, datos).then((result: any) => {
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
