import { Router, Request, Response } from 'express';
import Padre from '../classes/padre';

const router = Router();
const padre = new Padre();

router.post('/padre/create', (req: Request, res: Response) => {
    let datos = { ...req.body };
    padre.insertPadre(datos).then((result: any) => {
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

router.get('/padre/:id', (req: Request, res: Response) => {
    let id = req.params.id;
    padre.getPadre(id).then((result: any) => {
        res.status(200).json(result);
    }).catch((err: any) => {
        res.status(500).json({
            'success': false,
            'result': err
        });
    });
});

router.put('/padre/update/:id', (req: Request, res: Response) => {
    let id = req.params.id;
    let datos = { ...req.body };
    padre.updatePadre(id, datos).then((result: any) => {
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
