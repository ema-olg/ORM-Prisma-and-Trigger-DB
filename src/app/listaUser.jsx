import { useEffect, useState } from "react";


const ListaUser = prop => {
    const { setEditingUser, socket } = prop
    const [data, setData] = useState()

    useEffect(() => {
        fetch('/api/users')
            .then(res => res.json())
            .then(data => {
                setData(data)
            })


        socket.onAny((event, dataSQL) => {
            if (event === 'users_update') {
                setData(prevData => {
                    const existe = prevData.some(user => user.id === dataSQL.id)
                    return existe
                        ? prevData.map(user => user.id === dataSQL.id ? dataSQL : user)
                        : [...prevData, dataSQL]
                })
                console.log('Nuevos datos agregados a la lista')
            } else if (event === 'users_delete') {
                setData(prevData => prevData.filter(user => user.id !== dataSQL.id));
            }
        })
        return () => {
            socket.offAny()
        }
    }, []);

    // Eliminar un usuario
    const eliminarUsuario = async id => {
        const response = await fetch('/api/users', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id })
        })

    }


    return (
        <>
            <h1>Usuarios</h1>
            {data
                ? (
                    data.length === 0
                        ? <p>Sin datos</p>
                        : (
                            <table>
                                <thead>
                                    <tr>
                                        <th>Email</th>
                                        <th>Password</th>
                                        <th>Eliminar</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {data.map((el) => (
                                        <tr key={el.id}>
                                            <td>{el.email}</td>
                                            <td>{el.password}</td>
                                            <td>
                                                <button onClick={() => {
                                                    eliminarUsuario(el.id)
                                                }}>Delete</button>
                                                <button onClick={() => {
                                                    setEditingUser(el)
                                                }}>Editar</button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ))
                : <p>cargando...</p>
            }
        </>
    );
}

export default ListaUser;