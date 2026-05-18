import { User, type IUserDocument } from '../models/User.model';

export const userRepository = {
  findByEmail: (email: string, includePassword = false): Promise<IUserDocument | null> => {
    const query = User.findOne({ email: email.toLowerCase() });
    if (includePassword) {
      return query.select('+password').exec();
    }
    return query.exec();
  },

  findById: (id: string): Promise<IUserDocument | null> => User.findById(id).exec(),

  create: (data: {
    name: string;
    email: string;
    password: string;
    role?: IUserDocument['role'];
  }): Promise<IUserDocument> => User.create(data),
};
