import { Router, Request, Response } from 'express';

class AppRouter {

    private router: Router;

    constructor() {
        this.router = Router();
        this.config();
    }

    private config(): void {
        this.router.get('/', this.getAppInfo);
    }

    private getAppInfo(req: Request, res: Response): void {
        res.status(200).json({
            name: "MiGrade",
            version: "1.0.0",
            description: "MiGrade",
            repository: {
                type: "git",
                url: "git+https://github.com/Proyectos-Invenio/MiGrade_API_REST",
            },
        });
    }

    public getRouter(): Router {
        return this.router;
    }
}

const appRouter = new AppRouter();
export default appRouter.getRouter();