export const prerender = false;

import type { APIRoute } from 'astro';

const INTERCOM_ACCESS_TOKEN = import.meta.env.INTERCOM_ACCESS_TOKEN;
const TURNSTILE_SECRET_KEY = import.meta.env.TURNSTILE_SECRET_KEY;

export const POST: APIRoute = async ({ request }) => {
  const formData = await request.formData();
  const token = formData.get('cf-turnstile-response')?.toString() || '';

  const verifyRes = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
    method: 'POST',
    body: new URLSearchParams({
      secret: TURNSTILE_SECRET_KEY || '2x00000000000000000000BB', // if not set, use a dummy value that always fails
      response: token
    })
  });

  const verifyData = await verifyRes.json();

  if (!verifyData.success) {
    console.warn("Turnstile failed:", verifyData);
    return new Response(JSON.stringify({ error: 'Turnstile verification failed' }), {
      status: 403,
      headers: { 'Content-Type': 'application/json' }
    });
  }
  if (!INTERCOM_ACCESS_TOKEN) {
    return new Response(JSON.stringify({ error: 'Missing Intercom token' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  const data = Object.fromEntries(formData.entries());
  console.log('Received data:', data);
  if (!data.email) {
    return new Response(JSON.stringify({ error: 'Email is required' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  try {
    const response = await fetch('https://api.intercom.io/contacts', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${INTERCOM_ACCESS_TOKEN}`,
        'Content-Type': 'application/json',
        Accept: 'application/json'
      },
      body: JSON.stringify({
        role: data.role || 'lead',
        email: data.email,
        name: data.name,
        custom_attributes: data.custom_attributes
      })
    });

    const result = await response.json();

    if (!response.ok) {
      return new Response(JSON.stringify({
        error: 'Failed to create lead in Intercom',
        details: result
      }), {
        status: response.status,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    return new Response(JSON.stringify({
      success: true,
      message: 'Lead created successfully',
      contact: result
    }), {
      status: 201,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (err) {
    return new Response(JSON.stringify({ error: 'Unhandled server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
