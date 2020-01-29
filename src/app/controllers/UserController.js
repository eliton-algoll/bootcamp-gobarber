import * as Yup from 'yup';
import User from '../models/User';

class UserController {
  // método para cadastrar um novo usuário
  async store(req, res) {
    // criando validações
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string()
        .email()
        .required(),
      password: Yup.string()
        .required()
        .min(6),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const userExists = await User.findOne({ where: { email: req.body.email } });

    if (userExists) {
      return res.status(400).json({ error: 'User already exists.' });
    }

    const { id, name, email, provider } = await User.create(req.body);

    return res.json({ id, name, email, provider });
  }

  // método para editar o usuário
  async update(req, res) {
    // criando validações
    const schema = Yup.object().shape({
      name: Yup.string(),
      email: Yup.string().email(),
      password: Yup.string()
        .min(6)
        .when('oldPassword', (oldPassword, field) =>
          oldPassword ? field.required() : field
        ),
      confirmPassword: Yup.string().when('password', (password, field) =>
        password ? field.required().oneOf([Yup.ref('password')]) : field
      ),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }
    const { email, oldPassword } = req.body;

    const user = await User.findByPk(req.userId);

    // verificando se o usuário alterou o email
    if (email && email !== user.email) {
      // se tiver tentando alterar o email, verifico se o novo email já não existe
      const userExists = await User.findOne({ where: { email } });
      if (userExists) {
        return res.status(400).json({ error: 'email already exists.' });
      }
    }

    // verificando a senha
    if (oldPassword && !(await user.checkPassword(oldPassword))) {
      return res.status(401).json({ error: 'password does not match.' });
    }

    const { id, name, provider } = await user.update(req.body);

    return res.json({ user: { id, name, email, provider } });
  }
}

export default new UserController();
