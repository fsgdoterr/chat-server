import { AggregateOptions, AnyKeys, Document, FilterQuery, Model, PipelineStage, ProjectionType, QueryOptions, Types, UpdateQuery } from "mongoose";

export abstract class MongoBaseRepository<TDocument extends Document> {

    constructor(protected model: Model<TDocument>) {}

    async create(doc: TDocument | AnyKeys<TDocument>): Promise<TDocument> {
        return await this.model.create(doc);
    }

    async find(
        filter: FilterQuery<TDocument>,
        projection?: ProjectionType<TDocument>,
        options?: QueryOptions<TDocument>,
    ) {
        return await this.model.find(filter, projection, {lean: true, ...options});
    }

    async findOne(
        filter: FilterQuery<TDocument>,
        projection?: ProjectionType<TDocument>,
        options?: QueryOptions<TDocument>,
    ) {
        return await this.model.findOne(filter, projection, {lean: true, ...options});
    }

    async findOneAndUpdate(
        filter: FilterQuery<TDocument>,
        update: UpdateQuery<TDocument>,
        options?: QueryOptions<TDocument>,
    ) {
        return await this.model.findOneAndUpdate(filter, update, {lean: true, ...options});
    }

    async findOneAndDelete(
        filter: FilterQuery<TDocument>,
        options?: QueryOptions<TDocument>,
    ) {
        return await this.model.findOneAndDelete(filter, {lean: true, ...options});
    }

    async findById(
        id: string | Types.ObjectId,
        projection?: ProjectionType<TDocument>,
        options?: QueryOptions<TDocument>,
    ) {
        return await this.model.findById(id, projection, {lean: true, ...options});
    }

    async findByIdAndUpdate(
        id: string | Types.ObjectId,
        update: UpdateQuery<TDocument>,
        options?: QueryOptions<TDocument>,
    ) {
        return await this.model.findByIdAndUpdate(id, update, {lean: true, ...options});
    }

    async findByIdAndDelete(
        id: string | Types.ObjectId,
        options?: QueryOptions<TDocument>,
    ) {
        return await this.model.findByIdAndDelete(id, {lean: true, ...options});
    }

    async countDocuments(
        filter: FilterQuery<TDocument>,
    ) {
        return await this.model.countDocuments(filter);
    }

    async aggregate(pipeline?: PipelineStage[], options?: AggregateOptions) {
        return await this.model.aggregate(pipeline, options);
    }

}