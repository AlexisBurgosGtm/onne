const express = require('express');
const router = express.Router();
const execute = require('./connection');

let con;


router.post("/delete_token", async(req,res)=>{

	const {token} = req.body;

	let qr = `DELETE TOKENS WHERE TOKEN='${token}';`
	execute.Query(res,qr);

});


router.post("/update_status_token", async(req,res)=>{

	const {token,sino} = req.body;

	let qr = `UPDATE TOKENS SET ACTIVO='${sino}' WHERE TOKEN='${token}';`
	execute.Query(res,qr);

});


router.post("/qry_tokens", async(req,res)=>{

	const {host,timeout} = req.body;

	let qr = `SELECT TOKEN, EMPRESA, ACTIVO, CLAVE FROM TOKENS;`
	execute.Query(res,qr);

});

router.post("/delete_anydesk", async(req,res)=>{

	const {id} = req.body;

	let qr = `DELETE FROM SOPORTE_ANYDESK WHERE ID=${id};`
	execute.Query(res,qr);

});

router.post("/update_anydesk", async(req,res)=>{

	const {id,lastupdate} = req.body;

	let qr = `UPDATE SOPORTE_ANYDESK SET LASTUPDATE='${lastupdate}' WHERE ID=${id};`
	execute.Query(res,qr);

});

router.post("/insert_anydesk", async(req,res)=>{

	const {token,sucursal,tipo,anydesk,pass,vendedor,fecha} = req.body;


	let qr = `INSERT INTO SOPORTE_ANYDESK (TOKEN,SUCURSAL,TIPO, ANYDESK,PASS,VENDEDOR,LASTUPDATE) 
				VALUES ('${token}','${sucursal}','${tipo}','${anydesk}','${pass}','${vendedor}','${fecha}');`

	execute.Query(res,qr);

});

router.post("/listado_anydesk", async(req,res)=>{

	const {} = req.body;

	let qr = `SELECT ID, TOKEN, TIPO, ANYDESK, PASS, VENDEDOR, SUCURSAL, LASTUPDATE FROM SOPORTE_ANYDESK;`
	execute.Query(res,qr);

});

router.post("/soporte_finalizar", async(req,res)=>{

	const {id} = req.body;

	let qr = `UPDATE SOPORTE_CLIENTES SET ST='FINALIZADO' WHERE ID=${id};`
	execute.Query(res,qr);

});

router.post("/soporte_respuesta", async(req,res)=>{

	const {id,respuesta} = req.body;

	let qr = `UPDATE SOPORTE_CLIENTES SET RESPUESTA='${respuesta}' WHERE ID=${id};`
	execute.Query(res,qr);

});

router.post("/soporte", async(req,res)=>{

	const {} = req.body;

	let qr = `SELECT ID,TOKEN, USUARIO, HORA, FECHA, MOTIVO, TELEFONO, isnull(RESPUESTA,'Pendiente') as RESPUESTA FROM SOPORTE_CLIENTES WHERE ST='PENDIENTE' ORDER BY ID;`
	execute.Query(res,qr);

});


// LOGIN
router.post("/login", async(req,res)=>{
	console.log('login solicitado...' + req.body)
	const {app,usuario,pass} = req.body;

	let qr = `SELECT TOKEN,USUARIO,SISTEMA FROM COMMUNITY_USUARIOS WHERE USUARIO='${usuario}' AND CLAVE='${pass}' AND APP='${app}'`
	execute.Query(res,qr);

});


router.post("/qry", async(req,res)=>{
	
	const {host, qry, timeout} = req.body;
	
	getConnection(host,timeout);
	
	
	const sql2 = require('mssql');
	try {
		const pool1 = new sql2.ConnectionPool(con, err => {
		  new sql2.Request(pool1)
		  .query(qry, (err, result) => {
			  if(err){
				  res.send(err.message)
			  }else{
				  res.send(result);
			  }					
		  })
		  sql2.close();  
		})
		pool1.on('error', err => {
			console.log('error sql = ' + err);
			sql2.close();
		})
	  } catch (error) {
		res.send('Error al ejecutar la consulta: ' + error)   
	  };

});

router.post("/qryreducedb", async(req,res)=>{
	
	const {host, timeout} = req.body;
	
	let db = '';

	getConnection(host,timeout);

	let dbs = con.database;

	let qry = `
		USE ${dbs};
        ALTER DATABASE ${dbs} SET RECOVERY SIMPLE;
        DBCC SHRINKDATABASE (${dbs},25); 
        ALTER DATABASE ${dbs} SET RECOVERY FULL;
	`;

	
	const sql2 = require('mssql');
	try {
		const pool1 = new sql2.ConnectionPool(con, err => {
		  new sql2.Request(pool1)
		  .query(qry, (err, result) => {
			  if(err){
				  res.send(err.message)
			  }else{
				  res.send(result);
			  }					
		  })
		  sql2.close();  
		})
		pool1.on('error', err => {
			console.log('error sql = ' + err);
			sql2.close();
		})
	  } catch (error) {
		res.send('Error al ejecutar la consulta: ' + error)   
	  };

});

router.post("/qry_usuarios", async(req,res)=>{
	
	const {host, timeout} = req.body;
	
	let qry = `
		SELECT ID,CODSUCURSAL,CODUSUARIO,NOMBRE,PASS,LAT,LONG,CODDOC,CORRELATIVO,TIPO FROM ME_USUARIOS ORDER BY CODSUCURSAL,TIPO
	`

	getConnection(host,timeout);
	
	
	const sql2 = require('mssql');
	try {
		const pool1 = new sql2.ConnectionPool(con, err => {
		  new sql2.Request(pool1)
		  .query(qry, (err, result) => {
			  if(err){
				  res.send(err.message)
			  }else{
				  res.send(result);
			  }					
		  })
		  sql2.close();  
		})
		pool1.on('error', err => {
			console.log('error sql = ' + err);
			sql2.close();
		})
	  } catch (error) {
		res.send('Error al ejecutar la consulta: ' + error)   
	  };

});

router.post("/update_usuario", async(req,res)=>{
	
	const {host, id, usuario, pass, coddoc, correlativo, codsucursal} = req.body;
	
	let qry = `
		UPDATE ME_USUARIOS SET
			NOMBRE='${usuario}',
			PASS='${pass}',
			CODDOC='${coddoc}',
			CORRELATIVO=${correlativo}
			WHERE ID=${id};
		UPDATE ME_TIPODOCUMENTOS SET CORRELATIVO=${correlativo} WHERE CODSUCURSAL='${codsucursal}' AND CODDOC='${coddoc}';
	`

	getConnection(host,0);
	
	
	const sql2 = require('mssql');
	try {
		const pool1 = new sql2.ConnectionPool(con, err => {
		  new sql2.Request(pool1)
		  .query(qry, (err, result) => {
			  if(err){
				  res.send(err.message)
			  }else{
				  res.send(result);
			  }					
		  })
		  sql2.close();  
		})
		pool1.on('error', err => {
			console.log('error sql = ' + err);
			sql2.close();
		})
	  } catch (error) {
		res.send('Error al ejecutar la consulta: ' + error)   
	  };

});


function getConnection(host,timeout){
	
	switch (host) {
		case 'ONNE':
			con = {
				user: 'DB_A54053_Respaldobd_admin',
				password: 'Alexis2020',
				server: 'SQL5049.site4now.net',
				database: 'DB_A54053_Respaldobd',
				pool: {	max: 100,	min: 0,	idleTimeoutMillis: timeout}
			};	
			break;
		case 'MERCADOS':
			con = {
				user: 'DB_A6478C_mercadosv2_admin',
				password: 'razors1805',
				server: 'sql5060.site4now.net',
				database: 'DB_A6478C_mercadosv2',
				pool: {	max: 100,	min: 0,	idleTimeoutMillis: timeout}
			};
			break;
		case 'MERCADOSBI':
			con = {
					user: 'db_a6478c_mercadosbi_admin',
					password: 'razors1805',
					server: 'sql5061.site4now.net',
					database: 'db_a6478c_mercadosbi',
					pool: {	max: 100,	min: 0,	idleTimeoutMillis: timeout}
				};
				break;
		case 'LTJ':
			con = {
				user: 'DB_A6478C_ltjdistribuidores_admin',
				password: 'razors1805',
				server: 'sql5066.site4now.net',
				database: 'DB_A6478C_ltjdistribuidores',
				pool: {	max: 100,	min: 0,	idleTimeoutMillis: timeout}
			};			
			break;
		case 'FARMASALUD':
			con = {
				user: 'DB_A671FA_farmasalud_admin',
				password: 'Celta2005',
				server: 'sql5095.site4now.net',
				database: 'DB_A671FA_farmasalud',
				pool: {	max: 100,	min: 0,	idleTimeoutMillis: timeout}
			};			
			break;
		case 'DISTRIBUIDORAS':
				con = {
					user: 'db_a6478c_prueba_admin',
					password: 'razors1805',
					server: 'sql5079.site4now.net',
					database: 'db_a6478c_prueba',
					pool: {	max: 100,	min: 0,	idleTimeoutMillis: timeout}
				};			
				break;
	};

};


module.exports = router;