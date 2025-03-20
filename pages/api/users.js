import prisma from "../../lib/prisma";

export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      const { email, password } = req.body;
      const newUser = await prisma.user.create({
        data: { email, password },
      });
      res.status(201).json(newUser);
    } catch (error) {
      res.status(500).json({ error: "Error al creat el usuario" });
    }
  } else if (req.method === "GET") {
    try {
      const users = await prisma.user.findMany();
      res.status(200).json(users);
    } catch (error) {
      res.status(500).json({ message: "Error al obtener usuarios" });
    }
  } else if (req.method === "DELETE") {
    try {
      const { id } = req.body;
      if (!id) {
        return res.status(400).json({ error: "ID es requerido" });
      }
      const deleteUser = await prisma.user.delete({
        where: { id },
      });
      return res
        .status(200)
        .json({ message: "Usuario eliminado", user: deleteUser });
    } catch (error) {
      return res
        .status(500)
        .json({ error: "Error al eliminar usuario", details: error.message });
    }
  } else if (req.method === "PUT") {
    try{
      const {id, email, password}= req.body
      const updateUser= await prisma.user.update({
        where: {id},
        data:{email, password}
      })
      res.json(updateUser)
    }
    catch(error){
      console.log(error);
      res.status(500).json({error:'Error al actualizar usuario'})      
    }
  } else {
    res.status(405).json({ error: "metodo no permitido" });
  }
}
