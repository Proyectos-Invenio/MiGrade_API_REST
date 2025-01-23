import { Router, Request, Response } from 'express';
import VisibilidadMenu from '../classes/visibilidad_menu';

const router = Router();
const visibilidadMenu = new VisibilidadMenu();

router.post('/visibilidad_menu/create', (req: Request, res: Response) => {
    let datos = { ...req.body };
    visibilidadMenu.insertVisibilidadMenu(datos).then((result: any) => {
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

router.get('/visibilidad_menu/:id', (req: Request, res: Response) => {
    let id = req.params.id;
    visibilidadMenu.getVisibilidadMenu(id).then((result: any) => {
        res.status(200).json(result);
    }).catch((err: any) => {
        res.status(500).json({
            'success': false,
            'result': err
        });
    });
});

router.put('/visibilidad_menu/update/:id', (req: Request, res: Response) => {
    let id = req.params.id;
    let datos = { ...req.body };
    visibilidadMenu.updateVisibilidadMenu(id, datos).then((result: any) => {
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
