// src/pages/api/create-lead.ts
import type { APIRoute } from 'astro';

export const POST: APIRoute = async ({ request }) => {
  try {
    const INTERCOM_ACCESS_TOKEN= import.meta.env.INTERCOM_ACCESS_TOKEN;
    console.log('Token de Intercom:', INTERCOM_ACCESS_TOKEN);
    if (!INTERCOM_ACCESS_TOKEN) {
      return new Response(JSON.stringify({
        error: "Token de Intercom no configurado"
      }), { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    const data = await request.json();
    console.log('Datos recibidos:', data);
    
    if (!data.email) {
      return new Response(JSON.stringify({ 
        error: "El email es obligatorio" 
      }), { 
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    const response = await fetch('https://api.intercom.io/contacts', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${INTERCOM_ACCESS_TOKEN}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        role: data.role || 'lead',
        email: data.email,
        name: data.name,
        custom_attributes: data.custom_attributes,
      })
    });
    
    const result = await response.json();
    
    if (!response.ok) {
      console.error('Error de Intercom:', result);
      return new Response(JSON.stringify({
        error: "Error al crear lead en Intercom",
        details: result
      }), { 
        status: response.status,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    return new Response(JSON.stringify({
      success: true,
      message: "Lead creado exitosamente",
      contact: result
    }), { 
      status: 201,
      headers: { 'Content-Type': 'application/json' }
    });
    
  } catch (error) {
    console.error('Error al procesar solicitud de lead:', error);
    return new Response(JSON.stringify({
      error: "Error al procesar la solicitud"
    }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}