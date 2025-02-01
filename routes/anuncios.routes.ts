import { Router, Request, Response } from 'express';
import Anuncios from '../classes/anuncios';

const router = Router();
const anuncios = new Anuncios();

router.post('/anuncios/create', (req: Request, res: Response) => {
    let datos = { ...req.body };
    anuncios.insertAnuncio(datos).then((result: any) => {
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

router.get('/anuncios/:id', (req: Request, res: Response) => {
    let id = req.params.id;
    anuncios.getAnuncio(id).then((result: any) => {
        res.status(200).json(result);
    }).catch((err: any) => {
        res.status(500).json({
            'success': false,
            'result': err
        });
    });
});

router.put('/anuncios/update/:id', (req: Request, res: Response) => {
    let id = req.params.id;
    let datos = { ...req.body };
    anuncios.updateAnuncio(id, datos).then((result: any) => {
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
