import { useEffect, useState } from "react";
import { io } from "socket.io-client";

const ListaUser = prop => {
    let { state } = prop
    const [data, setData] = useState()


    useEffect(() => {
               fetch('/api/users')
            .then(res => res.json())
            .then(data => {
                setData(data)
            })

            const socket= io({
                path: "/api/socket"
            })

            
            socket.on("users_update", (data)=>{
                setData((prevData)=>[...prevData, data])
                console.log('Nuevos datos agregados a la lista')
            })

            return()=>{
                socket.off("users_update");
                socket.disconnect()
            }     
    }, []);

    // Eliminar un usuario
    const eliminarUsuario= async id=>{
        const response= await fetch('/api/users',{
            method: 'DELETE',
            headers:{'Content-Type': 'application/json'},
            body: JSON.stringify({id})
        })
        
        let dataDelete= data.filter(el => el.id !== id);
        setData(dataDelete)
    }

    return (
        <>
            <h1>Usuarios</h1>
            {data
                ?(
                    <table>
                        <thead>
                            <tr>
                                <th>Email</th>
                                <th>Password</th>
                                <th>Eliminar</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.map((el, index) => (
                                <tr key={index}>
                                    <td>{el.email}</td>
                                    <td>{el.password}</td>
                                    <td>
                                    <button onClick={()=>{
                                        eliminarUsuario(el.id)
                                    }}>Delete</button>
                                    <button onClick={()=>{
                                        eliminarUsuario(el.id)
                                    }}>Editar</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )            
                :<p>Cargando...</p>
                }
        </>
    );
}

export default ListaUser;