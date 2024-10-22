
class Script{

    truncateCxc(){
        return `TRUNCATE TABLE cuentasxcobrar`
    }

    updateCharacters(){
        return `UPDATE cuentasxcobrar 
        SET cliente = REPLACE(cliente, '¥', 'Ñ')
        WHERE cliente LIKE '%¥%'`;
    }

    insertCxc(){
        return `
        INSERT INTO cuentasxcobrar (
            ruc, cliente, contrato, valor_cuota, tesoreria, telefono, correo,
            agencia, plan, cartera, nota, status_poliza, periodo_pago,
            fechaVencimientoCxc, dias_vencidos, idcxc, fechaVentaContrato, edad,
            poliza, Ciudad, Sexo, fechaInicioPoliza, status_contract
            ) VALUES ?`;
    }

    selectCxc(){
        return `SELECT * FROM cuentasxcobrar limit 10`;
    }
    
    selectAllCxc(){
        return `SELECT * FROM vista_reporte_cuentasxcobrar WHERE length(telefono) = 10 LIMIT 5`;
    }


}

module.exports = {
    Script
}