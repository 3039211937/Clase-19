import User from "../models/user.model.js";

class UserRepository {

    async crear(email, password, username) {
        const user = new User({
            email,
            password,
            username
        });

        return await user.save();
    }

    async buscarUnoPorEmail(email) {
        return await User.findOne({ email });
    }

    async eliminarPorId(user_id) {
        await User.findByIdAndDelete(user_id);
    }

    async desactivarPorId(user_id) {
        return await User.findByIdAndUpdate(
            user_id,
            { active: false },
            { new: true }
        );
    }

    async actualizarPorId(user_id, nuevosDatos) {
        return await User.findByIdAndUpdate(
            user_id,
            nuevosDatos,
            { new: true }
        );
    }

    async obtenerTodos() {
        return await User.find();
    }

    async obtenerUnoPorId(user_id) {
        return await User.findById(user_id);
    }
}

const userRepository = new UserRepository();
export default userRepository;