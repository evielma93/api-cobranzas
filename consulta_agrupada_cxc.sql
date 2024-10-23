SELECT cxc.*, 
    (SELECT DISTINCT contract_code 
     FROM polizas p 
     WHERE p.id = cxc.poliza) AS contract_code,      
    -- Tesoreria acumulada por contrato 
    SUM(cxc.tesoreria) AS total_tesoreria_acumulada,
    -- Cantidad acumulada por contrato 
    COUNT(*) AS cantidad_acumulada_por_contrato,
    -- Tomamos la fecha mínima de todas por contrato
    MIN(cxc.fechavencimientocxc) AS menor_fecha_vencimiento,
    -- Calculamos los días de vencimiento nuevamente porque el reporte se sacó el martes 
    DATEDIFF(CURRENT_DATE, MIN(cxc.fechavencimientocxc)) AS dias_transcurridos,
    -- Última fecha de pago en base a los ingresos 
    MAX((
        SELECT MAX(ing.fecha) 
        FROM reporte_ingresos_etl ing  
        WHERE ing.contract = (SELECT DISTINCT contract_code FROM polizas p WHERE p.id = cxc.poliza)
    )) AS ultima_fecha_pago,
    -- Provincia basada en la ciudad 
    GROUP_CONCAT(DISTINCT CASE 
        WHEN cxc.Ciudad = 'Quito' THEN 'Pichincha'
        WHEN cxc.Ciudad = 'Manta' THEN 'Manabí'
        WHEN cxc.Ciudad = 'Guayaquil' THEN 'Guayas'
        WHEN cxc.Ciudad = 'Cuenca' THEN 'Azuay'
        ELSE 'Otra Provincia'
    END) AS Provincia
FROM cuentasxcobrar cxc
WHERE cxc.fechavencimientocxc BETWEEN '2024-06-01' AND '2024-10-22'
  AND cxc.dias_vencidos > 30 
  AND cxc.tesoreria > 0
  AND cxc.status_contract <> 'INACTIVO'
GROUP BY contract_code
ORDER BY menor_fecha_vencimiento DESC;