function InicializarLogin(){
    funciones.loadCss('./css/page-login.css','root');
    btnIniciar.addEventListener('click',()=>{
        fcnLogin('txtUsuario','txtPass','cmbApp')
    })   
}

async function fcnLogin(idUser,idPass,idApp){
    let usuario = document.getElementById(idUser).value;
    let pass = document.getElementById(idPass).value;
    let App = document.getElementById(idApp).value;

    axios.post('/usuarios/login', {
        usuario: usuario,
        pass: pass,
        app: App
    })
    .then((response) => {
        const data = response.data;
        data.recordset.map((rows)=>{
            if(rows.USUARIO==usuario){
                GlobalToken=rows.TOKEN;
                GlobalUser = rows.USUARIO;
                GlobalSistema = rows.SISTEMA;
                fcnIniciar(App);
            }else{
                funciones.AvisoError('Usuario y/o contraseña incorrectas')    
            }
        })
 
    }, (error) => {
        console.log(error);
    });

}

async function fcnIniciar(application){
    
    switch (application) {
        case 'GERENCIA':
            btnMenuInventarios.style = "visibility:visible";
            btnMenuVentas.style = "visibility:visible";
            btnMenuProductos.style = "visibility:visible";
            btnMenuCortes.style = "visibility:visible";
            btnMenuCortes.style = "visibility:visible";
            btnMenuMapa.style = "visibility:visible";
        
            classNavegar.dashventas();
            
            break;

        case 'AGENDA':
            classNavegar.agenda();

            break;
        case 'VENTAS':
            classNavegar.appVentas();  
            
        break;
    
        default:
            break;
    }



}