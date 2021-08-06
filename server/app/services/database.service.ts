import { Drawing } from '@common/communication/drawing';
import { DATABASE_DELETE_REQ_ERROR, DATABASE_GET_REQ_ERROR, DATABASE_UNAVAIBLE } from '@common/constants/server-message-error.constants';
import { injectable } from 'inversify';
import { Db, MongoClient, MongoClientOptions, ObjectID } from 'mongodb';

const DATABASE_URL = 'mongodb+srv://admin:admin123456@cluster0.idld9.mongodb.net/myFirstDatabase?retryWrites=true&w=majority';
const DATABASE_NAME = 'DrawingApp';
const DATABASE_COLLECTION = 'drawings';

interface DrawingData {
    _id?: string;
    name: string;
    tags: string[];
}

@injectable()
export class DatabaseService {
    private db: Db;
    private client: MongoClient;

    private options: MongoClientOptions = {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    };

    // source: moodle
    async start(url: string = DATABASE_URL): Promise<MongoClient> {
        try {
            const client = await MongoClient.connect(url, this.options);
            this.client = client;
            this.db = client.db(DATABASE_NAME);
        } catch {
            throw new Error(DATABASE_UNAVAIBLE);
        }
        return this.client;
    }

    async sendDataToDb(drawing: Drawing): Promise<string | undefined> {
        const drawingData: DrawingData = { name: drawing.name, tags: drawing.tags };
        await this.db.collection(DATABASE_COLLECTION).insertOne(drawingData);
        return drawingData._id;
    }

    async getAllDrawings(): Promise<Drawing[]> {
        try {
            return this.db.collection(DATABASE_COLLECTION).find({}).toArray();
        } catch (e) {
            throw new Error(DATABASE_GET_REQ_ERROR);
        }
    }

    async deleteDrawing(drawingId: string): Promise<void> {
        try {
            await this.db.collection(DATABASE_COLLECTION).deleteOne({ _id: new ObjectID(drawingId) });
        } catch (e) {
            throw new Error(DATABASE_DELETE_REQ_ERROR);
        }
    }
}
