import { Router, Request, Response } from 'express';
import Profesor from '../classes/profesor';

const router = Router();
const profesor = new Profesor();

router.post('/profesor/create', (req: Request, res: Response) => {
    let datos = { ...req.body };
    profesor.insertProfesor(datos).then((result: any) => {
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

router.get('/profesor/:id', (req: Request, res: Response) => {
    let id = req.params.id;
    profesor.getProfesor(id).then((result: any) => {
        res.status(200).json(result);
    }).catch((err: any) => {
        res.status(500).json({
            'success': false,
            'result': err
        });
    });
});

router.put('/profesor/update/:id', (req: Request, res: Response) => {
    let id = req.params.id;
    let datos = { ...req.body };
    profesor.updateProfesor(id, datos).then((result: any) => {
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
