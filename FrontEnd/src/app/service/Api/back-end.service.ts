import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { CookieService } from 'ngx-cookie-service';
import { environment } from 'src/environments/environment';

const api = environment.urlBE

@Injectable({
  providedIn: 'root'
})
/**
 * @Description Clase del backend 
 */
export class BackEndService {

  public httpOptions = {headers:new HttpHeaders({'Content-Type':'application/json'})};

  /**
   * Constructor
   * @param http Encargado de hacer request a la api
   * @param jwt Encargado de descomprimir el token
   * @param cookie Cookies
   */
  constructor(private http:HttpClient, private jwt:JwtHelperService, private cookie:CookieService) { }

  getDataToken(){
    const token = this.cookie.get('token') || ''
    return this.jwt.decodeToken(token)
  }

  //get
    //admins

  /**
   * Obtener informacionde elementos en el inventario
   * @returns Retorna una lista con todos los productos del inventario, no las que estan publicadas.
   */
  getInventoy(){
    return this.http.get<any>(api+'/inventory', this.httpOptions)
  }

  /**
   * Obtener informacion de elemento que estan publicados
   * @returns Retorna una lista con todos los productos del inventario publicado.
   */
  getShopItems(){
    return this.http.get<any>(api+"/clothe", this.httpOptions)
  }

  /**
   * Obtener unicamente un elemento de los publicados
   * @param title El titulo de la prenda que se quiere ver mas informacion
   * @returns La api retorna la informacion.
   */
  getShopItem(title:string){
    return this.http.get<any>(api+"/clothe/"+title,this.httpOptions)
  }

  /**
   * Un get que sirve para darle like a un comentario especifico
   * @param title titulo de la publicacion
   * @param id id del comentario al que se dara like
   * @returns devuelve el nuevo ya con el like
   */
  setLike(title:string, id:number){
    return this.http.get<any>(api+'/clothe/'+title+'/comment/like/'+id, this.httpOptions)
  }

  /**
   * Un get que sirve para darle dislike a un comentario especifico
   * @param title titulo de la publicacion
   * @param id id del comentario al que se dara dislike
   * @returns devuelve el nuevo ya con el dislike
   */
  setDislike(title:string, id:number){
    return this.http.get<any>(api+'/clothe/'+title+'/comment/dislike/'+id, this.httpOptions)
  }

  /**
   * Envvia un codigo al correo de la cuenta que se quiere activar
   * @param email manda el correo electronico a la api para la activacion de la nueva cuenta que se esta por crear
   * @returns Retorna el token con el codigo de autenticacion.
   */
  activeAccount(email:any){
    return this.http.get<any>(api+ "/activate/"+email, this.httpOptions)
  }

    //Users
  
  /**
   * Nuevas publicaciones y nuevas ofertas.
   * @returns Devuelve todo las promociones y lo ultimo que se publico.
   */
  getNews(){
    return this.http.get<any>(api+"/news", this.httpOptions)
  }

  /**
   * Funcion que quita la puntuacion de una publicacion
   * @param _id Id de la publicacion
   * @returns Resultados de parte del backend
   */
  deleteRate(_id:string){
    return this.http.get<any>(api+'/clothe/'+_id+'/ratent', this.httpOptions)
  }

  /**
   * 
   * @param title Titulo de la publicacion donde esta el comentario
   * @param id Id del comentario que se quitara el like
   * @returns Devuleve el resultado del parte del backend
   */
  setLikent(title:any, id:any){
    return this.http.get<any>(api+'/clothe/'+title+'/comment/likent/'+id,this.httpOptions)
  }

  /**
   * 
   * @param title Titulo de la publicacion donde esta el comentario
   * @param id Id del comentario que se quitara el dislike
   * @returns Devuleve el resultado del parte del backend
   */
  setDislikent(title:any, id:any){
    return this.http.get<any>(api+'/clothe/'+title+'/comment/dislikent/'+id,this.httpOptions)
  }

  //auth

  //post

  /**
   * Posta para registrar una nueva cuenta despues de la confirmacion del codigo
  * @param data Informacion de los usuarios, nombre, nombre de usuario, correo y contraseña 
   * @returns Retorna un token con el usuario, nombre y correo.
   */
  register(data:any){
    return this.http.post<any>(api + "/register", data, this.httpOptions)
  }

  /**
   * Post para iniciar secion en la pagina
   * @param data Informacion del usuario y contraseña
   * @returns retorna el token con el usuario, nombre y correo
   */
  login(data:any){
    return this.http.post<any>(api + "/login", data, this.httpOptions)
  }

  /**
   * Añadir un nuevo item al inventario
   * @param newItem Nuevo item de inventario
   * @returns Un json con el estado si guardo el nuevo item de inventario
   */
  addItem(newItem:any){
    return this.http.post<any>(api+'/inventory/add', newItem, this.httpOptions)
  }

  /**
   * Sube la imagen a _*cloudinary*_ donde se almacenara la imagen que se vera cuando se publique este elemento
   * @param val archivo de la imagen
   * @returns retorna la nueva informacion de la imagen, url... etc
   */
  uploadImage(val: any){
    let data = val
    return this.http.post<any>('http://api.cloudinary.com/v1_1/sekaijk/image/upload', data)
  }

  /**
   * Publica un elemento
   * @param data Informacion de los que se va publicar los nuevos items visibles al usuraio
   * @returns Retorna el estado de confirmacion de la api
   */
  shareItem(data:any){
    let v = {
      title: data.d.titleS,
      img: data.img,
      desc:data.d.desc,
      tag: data.d.tagS,
      date: data.d.date,
      cost: data.d.costS,
      inStock:data.d.inStockS}
    return this.http.post<any>(api+'/clothe/add', v , this.httpOptions);
  }

  /**
   * Publica un comentario
   * @param coment Comentario de usuario
   * @param title Titulo donde se publica el comentario
   * @returns Respuesta de la Api
   */
  postComment(coment:any, title:string){
    return this.http.post<any>(api+'/clothe/'+title+'/comment', coment, this.httpOptions)
  }

  //put

  /**
   * Put que utiliza para editar elemento del inventario
   * @param editItem Cambios sobre el item que se quiere editar
   * @param oldId Id del item
   * @returns Retorna la informacion de la api
   */
  editItem(editItem:any, _id:string){
    return this.http.put<any>(api+'/inventory/modfic/'+_id, { id_Name: editItem.id_Name, tag:editItem.tag, cost:editItem.cost, inStock:editItem.inStock} , this.httpOptions)
  }

  /**
   * edita un elemento publicado
   * @param _id Id de la publicacion
   * @param title Titulo nuevo del item
   * @param img Imagen nuevo del item
   * @param desc Descripcion nuevo del item
   * @param tag Tag nuevo del item
   * @param date Fecha nuevo del item
   * @param cost Costo nuevo del item
   * @param inStock Cuanto producto hay nuevo del item
   * @returns Retorna la informacion de la api
   */
  editShareItem(_id:string, item:any){
    console.log(item)
    return this.http.put<any>(api+'/clothe/edit/'+ _id, item, this.httpOptions);
  }

  /**
   * Funcion que manda a postear la calificacion
   * @param _id Id de la publicacion
   * @param rate calificacion de la publicacion
   * @returns resultado de parte del backend
   */
  setRate(_id:string, rate:number){
    return this.http.post<any>(api+'/clothe/'+_id+'/rate',{rate:rate}, this.httpOptions)
  }

  /**
   * Put para editar comentarios
   * @param comment Nuevo comentario
   * @param title Titulo del producto donde se comento
   * @param id Id del comentario
   * @returns Retorna si se cumplio la acion
   */
   editComment(comment:any, title:string, id:any){
    return this.http.put<any>(api+'/clothe/'+title+'/comment/edit/'+id, {content:comment}, this.httpOptions)
  }

  //delete

  /**
   * Elimina un elemento del inventario
   * @param id_Name Id del elemento del inventario
   * @returns Retorna informacion de la api
   */
  deleteItem(id_Name:string){
    return this.http.delete<any>(api+'/inventory/delete/'+id_Name, this.httpOptions)
  }

  /**
   * Elemina un elemento publicado en la pagina
   * @param title titulo del elemento que se quiere borrar
   * @returns Retorna la confirmacion de la api
   */
  deleteShareItem(title:string){
    return this.http.delete<any>(api+'/clothe/delete/'+title, this.httpOptions)
  }

  //Funciones
  
  /**
  * verifica si hay un token en las cookies o en session storages
  * @return {string} De haber un token, regresa el token, en caso contrario devuelve un string vacio("")
  */
   getToken():string{
    if(this.cookie.check('token')){
      return this.cookie.get('token')
    }
    else{
      return sessionStorage.getItem('token') || ''
    }
  }

  /**
   * Comprobacion del token
   * @returns Retorna _*True*_ si el usuario existe tanto en local storage como en las cookies o _*False*_ si esta expirado o no existe el token
   */
  auth(){
    try{
      if(this.cookie.check('token')){
        const token = this.cookie.get("token") || ""
        if(this.jwt.isTokenExpired(token) || !this.cookie.get("token")){
          return false;
        }
      }
      else{
        const token = sessionStorage.getItem('token') || ''
        if(this.jwt.isTokenExpired(token) || !sessionStorage.getItem('token')){
          return false
        }
      }
      return true;
    }catch(error){
      return false
    }
  }

}
