import Card from '@mui/material/Card';
import style from './style.module.css';
import { useForm, Controller, SubmitHandler } from 'react-hook-form';
import { logInUserInterface } from '@/interfaces/user/user';
import { enqueueSnackbar } from 'notistack';
import { redirect } from 'next/navigation';

const LoginForm = () => {
    const { handleSubmit, reset, control } = useForm();

    const onSubmit: SubmitHandler<logInUserInterface> = (data) => {
        data.email = data?.email?.trim() || undefined;
        data.password = data?.password?.trim();
        const isValidCredentials = isUserValid(data);
        if (isValidCredentials.success) {
            reset();
            enqueueSnackbar("Login Success");
            redirect('/dashboard');
        }
        else {
            enqueueSnackbar("Credentials you have entered are incorrect");
        }
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <Card className={`${style.card} `}>
                hi there login page
            </Card>
        </form>
    )
}

export default LoginForm;