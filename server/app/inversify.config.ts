import { IndexController } from '@app/controllers/index.controller';
import { DatabaseService } from '@app/services/database.service';
import { DrawingService } from '@app/services/drawing-service';
import { Container } from 'inversify';
import { Application } from './app';
import { Server } from './server';
import { TYPES } from './types';

export const containerBootstrapper: () => Promise<Container> = async () => {
    const container: Container = new Container();

    container.bind(TYPES.Server).to(Server);
    container.bind(TYPES.Application).to(Application);
    container.bind(TYPES.IndexController).to(IndexController);
    container.bind(TYPES.DrawingService).to(DrawingService);
    container.bind(TYPES.DatabaseService).to(DatabaseService);

    return container;
};
