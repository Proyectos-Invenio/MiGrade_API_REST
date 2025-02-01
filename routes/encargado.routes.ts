import { Router, Request, Response } from 'express';
import Encargado from "../classes/encargado";

const router = Router();
const encargado = new Encargado();

router.post('/encargado/create', (req: Request, res: Response) => {
    let datos = { ...req.body };
    encargado.insertEncargado(datos).then((result: any) => {
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

router.get('/encargado/:id', (req: Request, res: Response) => {
    let id = req.params.id;
    encargado.getEncargado(id).then((result: any) => {
        res.status(200).json(result);
    }).catch((err: any) => {
        res.status(500).json({
            'success': false,
            'result': err
        });
    });
});

router.put('/encargado/update/:id', (req: Request, res: Response) => {
    let id = req.params.id;
    let datos = { ...req.body };
    encargado.updateEncargado(id, datos).then((result: any) => {
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
