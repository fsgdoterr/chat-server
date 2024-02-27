import { Injectable } from '@nestjs/common';
import * as uuid from 'uuid';
import * as path from 'path';
import * as fs from 'fs';

@Injectable()
export class FileService {

    async uploadFile(file: Express.Multer.File) {
        const filename = uuid.v4();
        const extension = path.extname(file.originalname);

        const fullFileName = `${filename}${extension}`;

        const dirPath = this.getPublicPath('avatars');
        const filePath = path.join(dirPath, fullFileName);

        if(!fs.existsSync(dirPath)) {
            await this.makeDir(dirPath);
        }

        await this.writeFile(filePath, file.buffer);

        return fullFileName;
    }

    async deleteAvatar(fileName: string) {
        try {
            return await this.rm(this.getPublicPath(path.join('avatars', fileName)));
        } catch(e) {
            return null;
        }
    }

    private getPublicPath(p: string) {
        const publicPath = path.resolve(__dirname, '..', '..', '..', 'public');
        if(p) return path.join(publicPath, p);
        return publicPath;
    }

    private async makeDir(dirPath: string): Promise<string> {
        return new Promise((res, rej) => {
            fs.mkdir(dirPath, {recursive: true}, (err) => {
                if(err) rej(err);
                res(dirPath);
            });
        });
    }

    private async writeFile(_path: string, data: any): Promise<string> {
        return new Promise((res, rej) => {
            fs.writeFile(_path, data, (err) => {
                if(err) rej(err);
                res(_path);
            })
        })
    }

    private async rm(filePath: string): Promise<string> {
        console.log(filePath);
        
        return new Promise((res, rej) => {
            fs.rm(filePath, (err) => {
                if(err) rej(err);
                res(filePath);
            });
        });
    }

}
