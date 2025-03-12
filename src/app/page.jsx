'use client'
import { useForm } from "react-hook-form";
import ListaUser from "./listaUser";
import './errors.css'
import stateGlobal from "./StateGlobal";
import ReducerUser from "./action-reducers/reducer";
import ACTIONUSER from "./action-reducers/action";
import { useReducer, useState } from "react";

const page = () => {
    const { register, handleSubmit, formState: { errors }, reset } = useForm()

    const [menssage, setMenssage] = useState('');

    const [state, dispatch] = useReducer(ReducerUser, stateGlobal)


    const onsubmit = async data => {
        console.log(data)
        dispatch({type: ACTIONUSER.ADD_USER, payload: data})
        reset()
        setMenssage('')
        const res = await fetch('/api/users', {
            method: 'POST',
            headers: { 
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data),
        });
        console.log(res)
        if (res.ok) {
            setMenssage('Usuario creado exitosamente')
            reset()
        } else {
            setMenssage('Error al crear el Usuario')
        }
    };

    return (
        <>
            <form onSubmit={handleSubmit(onsubmit)}>
                <div>
                    <label htmlFor="email">Email</label><br />
                    {errors.email?.type === 'required' && <p className="errors">El Email es requerido</p>}
                    {errors.email?.type === 'maxLength' && <p className="errors">No debe exeder los 50 caracteres</p>}
                    <input type="text" id="email" {...register('email', {
                        required: true,
                        maxLength: 50
                    })} />
                </div>
                <div>
                    <label htmlFor="password">Contraseña</label><br />
                    {errors.password?.type === 'required' && <p className="errors">La contraseña es requerido</p>}
                    {errors.password?.type === 'maxLength' && <p className="errors">No debe exeder los 30 caracteres</p>}
                    <input type="password" id="password" {...register('password', {
                        required: true,
                        maxLength: 30
                    })} />
                </div>
                <button>Enviar</button>

            </form>
            {menssage && <hr />}
            {menssage}
            {menssage && <hr />}
            <ListaUser state={state} />
        </>
    );
}

export default page;