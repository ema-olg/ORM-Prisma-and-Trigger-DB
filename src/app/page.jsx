'use client'
import { useForm } from "react-hook-form";
import ListaUser from "./listaUser";
import './errors.css'
import stateGlobal from "./StateGlobal";
import ReducerUser from "./action-reducers/reducer";
import ACTIONUSER from "./action-reducers/action";
import { useEffect, useReducer, useState } from "react";
import { io } from "socket.io-client";

const socket = io({
    path: "/api/socket"
})

const page = () => {
    const { register, handleSubmit, formState: { errors }, reset, setValue, getValues } = useForm()

    const [menssage, setMenssage] = useState('');
    const [editingUser, setEditingUser] = useState(null);

    const [state, dispatch] = useReducer(ReducerUser, stateGlobal)


    const onsubmit = async data => {
        console.log(data)
        dispatch({ type: ACTIONUSER.ADD_USER, payload: data })
        reset()
        setMenssage('')
        const res = await fetch('/api/users', {
            method: 'POST',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        });
        console.log(res)
        if (res.ok) {
            setMenssage('Usuario creado exitosamente')
            reset()
            setTimeout(() => {
                setMenssage('')
            }, 3000);
        } else {
            setMenssage('Error al crear el Usuario')
        }
    };

    useEffect(() => {
        if (editingUser) {
            setValue('email', editingUser.email)
            setValue('password', editingUser.password)
        }
    }, [editingUser]);

    // Editar usuario
    const handleEdit = async (e, userId) => {
        e.preventDefault()
        console.log(userId);

        const response = await fetch('api/users/', {
            method: 'PUT',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({id:editingUser.id, ...getValues()})
        })
        if (response.ok) {
            const updateUser = await response.json()
            socket.emit('users_update', updateUser)
            setEditingUser(null)
            reset()
        }
    }

    // Cancelar
    const cancelarEdit = () => {
        setEditingUser(null);
        reset()
    }

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
                <button onClick={editingUser && ((e) => { handleEdit(e, editingUser) })}>{editingUser ? 'Guardar' : 'Enviar'}</button>
                {editingUser && <button onClick={cancelarEdit}>Cancelar</button>}
            </form>

            <div className="menssajeExito">
                <p className="mensaje">{menssage}</p>
            </div>
            <ListaUser state={state} setEditingUser={setEditingUser} socket={socket} />
        </>
    );
}

export default page;