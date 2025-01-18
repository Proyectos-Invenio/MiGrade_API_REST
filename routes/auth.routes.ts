import { Router, Request, Response } from 'express';
import Auth from '../classes/auth';
import Intervencion from '../classes/intervencion';
import  JWT from '../services/jwt';
import bcrypt from 'bcrypt';

const router = Router();
const auth = new Auth();
const intervencion = new Intervencion();
const _jwt = new JWT();

//$2b$10$tkkFazw6iB1VUXQS/QfUHeOKFEQaBp3slWTBgUcL9ij5AHZ2jqlHy
router.post('/auth/login', (req: Request, res: Response) => {

    let datos = { ...req.body };

    auth.login(datos).then( (result) => {
        bcrypt.compare( datos.password, result.password,  function(err, result2) {

            if (result2  == false || result2 === undefined) {
                return res.status(200).send({
                    response: "El usuario no ha podido iniciar sesión correctamente.",
                    success: false
                });
            } else {
                auth.getInfoUsuario(datos.identification).then((infoUsuario: any) => {
                    return res.status(200).send({
                        info: [infoUsuario],
                        success: true,
                        token: _jwt.CrearToken(result)
                    });
                }).catch(function (err: any) {
                    res.status(500).json({
                        success: false,
                        message: 'Error al iniciar sesión',
                        error: err.message
                    });
                });
            }
        });

    }).catch(function (err: string) {
        console.log('e', err);
        res.status(500).json("Errors:" + err);
    });
});

router.post('/auth/user/create', (req: Request, res: Response) => {

    let datos = { ...req.body };

    auth.insertUser(datos).then((result: any) => {
        res.status(200).json({
            'success': true,
            'result': result
        });
    }).catch(function (err: any) {
        console.log('err: ', err);

        res.status(500).json({
            'success': false,
            'result': err
        });
    });
});

router.get('/auth/user/info/:usuario', (req: Request, res: Response) => {

    let usuario = req.params.usuario;

    auth.getInfoUsuario(usuario).then((val: any) => {
        res.status(200).json(val);
    }, (err: any) => {
        res.status(500).json({
            ok: false,
            error: err
        });
    });
});

router.get('/auth/user/:id_usuario', (req: Request, res: Response) => {

    let id_usuario      = req.params.id_usuario;

    auth.getUsuarios(id_usuario).then((val: any) => {
        res.status(200).json(val);
    }, (err: any) => {
        console.log('err: ', err);

        res.status(500).json({
            ok: false,
            error: err
        });
    });
});


export default router;
