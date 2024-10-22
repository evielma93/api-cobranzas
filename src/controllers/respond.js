const axios = require('axios').default;
const TOKEN = process.env.TOKEN;

const url = `https://api.respond.io/v2/contact/phone:+593962517172`;
//const url2 = `https://api.respond.io/v2/contact/create_or_update/phone:+${contactdata.phone}`;
const config = { headers: { 'Authorization': `Bearer ${TOKEN}`, 'Content-Type': 'application/json','Accept': 'application/json, application/xml, multipart/form-data' }, timeout: 30000 };

const getContact = async (req, res) => {
  // https://api.respond.io/v2/contact/phone:+593962517172
  const options = {
    method: 'GET',
    url: 'https://api.respond.io/v2/contact/phone:+593962517172',
    headers: {
      Accept: 'application/json',
      Authorization: process.env.TOKEN
    }
  };

  try {
    const { data } = await axios.request(options);
    console.log(data);
    res.json(data);
  } catch (error) {
    console.error(error);
  }
}

const createContact = async (req, res) => {

  const { firstName, lastName, phone, email, language, countryCode } = req.body;
  try {
      const body = {
          firstName,
          lastName,
          phone,
          email,
          language,
          countryCode
      }
    const data = await axios.post(url,body,config);
    console.log(data);
    res.json(data);
  } catch (error) {
    console.error(error);
    res.json(error);
  }
}

async function create_or_update_contact(clientdata) {

  const body = {
    firstName: clientdata.nombre,
    lastName: clientdata.apellido,
    phone: clientdata.celular,
    custom_fields: [
      {
        name: "cedula",
        value: clientdata.cedula
      },
      {
        name: "valor_vencido",
        value: clientdata.saldo_capital
      },
      {
        name:"cuotas_vencidas",
        value:2
      }
    ]
  };

  try {

    const data = await axios.post(url,body,config); 
    return data;
  } catch (error) {
    console.error('Error creating or updating contact:', error);
    throw error;
  }
}





module.exports = { getContact, createContact }