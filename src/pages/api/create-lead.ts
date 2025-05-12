export const prerender = false;

import type { APIRoute } from 'astro';

// export const POST: APIRoute = async ({ request }) => {
//   try {
//     const INTERCOM_ACCESS_TOKEN= import.meta.env.INTERCOM_ACCESS_TOKEN;
//     console.log('Token de Intercom:', INTERCOM_ACCESS_TOKEN);
//     if (!INTERCOM_ACCESS_TOKEN) {
//       return new Response(JSON.stringify({
//         error: "Token de Intercom no configurado"
//       }), { 
//         status: 500,
//         headers: { 'Content-Type': 'application/json' }
//       });
//     }
    
//     const data = await request.json();
//     console.log('Datos recibidos:', data);
    
//     if (!data.email) {
//       return new Response(JSON.stringify({ 
//         error: "El email es obligatorio" 
//       }), { 
//         status: 400,
//         headers: { 'Content-Type': 'application/json' }
//       });
//     }
    
//     const response = await fetch('https://api.intercom.io/contacts', {
//       method: 'POST',
//       headers: {
//         'Authorization': `Bearer ${INTERCOM_ACCESS_TOKEN}`,
//         'Content-Type': 'application/json',
//         'Accept': 'application/json'
//       },
//       body: JSON.stringify({
//         role: data.role || 'lead',
//         email: data.email,
//         name: data.name,
//         custom_attributes: data.custom_attributes,
//       })
//     });
    
//     const result = await response.json();
    
//     if (!response.ok) {
//       console.error('Error de Intercom:', result);
//       return new Response(JSON.stringify({
//         error: "Error al crear lead en Intercom",
//         details: result
//       }), { 
//         status: response.status,
//         headers: { 'Content-Type': 'application/json' }
//       });
//     }
    
//     return new Response(JSON.stringify({
//       success: true,
//       message: "Lead creado exitosamente",
//       contact: result
//     }), { 
//       status: 201,
//       headers: { 'Content-Type': 'application/json' }
//     });
    
//   } catch (error) {
//     console.error('Error al procesar solicitud de lead:', error);
//     return new Response(JSON.stringify({
//       error: "Error al procesar la solicitud"
//     }), { 
//       status: 500,
//       headers: { 'Content-Type': 'application/json' }
//     });
//   }
// }

export const POST: APIRoute = async ({ request }) => {
  const formData = await request.formData();
  console.log('Form data received:', formData);
  const token = formData.get('cf-turnstile-response');

  const verifyRes = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
    method: 'POST',
    body: new URLSearchParams({
      secret: '0x4AAAAAABbm-k3Yib2X1BHrm6WzS2rMxDE', // store this in .env
      response: token?.toString() || ''
    })
  });

  const verifyData = await verifyRes.json();

  if (!verifyData.success) {
    return new Response('Turnstile verification failed', { status: 403 });
  }

  // Proceed with processing the form
  return new Response('Form submitted successfully', { status: 200 });
};