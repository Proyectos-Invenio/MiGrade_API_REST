import { Router, Request, Response } from 'express';
import Seccion from '../classes/secciones';

const router = Router();
const seccion = new Seccion();

router.post('/seccion/create', (req: Request, res: Response) => {
    let datos = { ...req.body };
    seccion.insertSeccion(datos).then((result: any) => {
        res.status(200).json({
            'success': true,
            'result': result
        });
    }).catch((err: any) => {
        console.error('Error al crear sección', err);
        res.status(err.status || 500).json({
            'success': false,
            'message': err.message || 'Hubo un error al crear la sección'
        });
    });
});

router.get('/seccion/:id', (req: Request, res: Response) => {
    let id = req.params.id;
    seccion.getSeccion(id).then((result: any) => {
        res.status(200).json(result);
    }).catch((err: any) => {
        res.status(500).json({
            'success': false,
            'result': err
        });
    });
});

router.put('/seccion/update/:id', (req: Request, res: Response) => {
    let id = req.params.id;
    let datos = { ...req.body };
    seccion.updateSeccion(id, datos).then((result: any) => {
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
