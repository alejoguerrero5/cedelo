// /app/api/contact/route.ts

import { supabase } from "@/lib/supabase";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY!);

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { name, email, phone, city, projectType, isVIS, terms } = body;

    //Save on DB
    const { error } = await supabase
      .from("leads")
      .insert([{ name, email, phone, city, projectType, isVIS, terms }]);

    if (error) {
      console.error(error);
      return new Response(JSON.stringify({ error: "Error guardando lead" }), {
        status: 500,
      });
    }

    //Send Email
    await resend.emails.send({
      from: "onboarding@resend.dev",
      to: "alejoguerrero5@gmail.com",
      subject: "Nuevo lead 🚀",
      html: `
        <div style="margin:0;padding:0;background-color:#f4f6f8;font-family:Arial,Helvetica,sans-serif;">
          <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f6f8;padding:20px 0;">
            <tr>
              <td align="center">
                
                <table width="100%" max-width="600px" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 4px 12px rgba(0,0,0,0.08);">
                  
                  <!-- HEADER -->
                  <tr>
                    <td style="background:linear-gradient(135deg,#0f172a,#1e293b);color:#ffffff;padding:24px;text-align:center;">
                      <h1 style="margin:0;font-size:22px;">Nuevo Lead 🚀</h1>
                      <p style="margin:8px 0 0;font-size:14px;opacity:0.85;">
                        Interesado en cesión de contrato
                      </p>
                    </td>
                  </tr>

                  <!-- BODY -->
                  <tr>
                    <td style="padding:24px;">
                      
                      <p style="margin-top:0;font-size:15px;color:#374151;">
                        Has recibido un nuevo cliente potencial en <b>CEDELO</b>:
                      </p>

                      <table width="100%" cellpadding="0" cellspacing="0" style="margin-top:16px;">
                        
                        ${[
                          ["Nombre", name],
                          ["Email", email],
                          ["Teléfono", phone],
                          ["Ciudad", city],
                          ["Proyecto", projectType],
                          ["Tipo", isVIS],
                        ]
                          .map(
                            ([label, value]) => `
                          <tr>
                            <td style="padding:10px 0;border-bottom:1px solid #e5e7eb;">
                              <span style="display:block;font-size:12px;color:#6b7280;">${label}</span>
                              <span style="font-size:15px;color:#111827;font-weight:600;">
                                ${value || "—"}
                              </span>
                            </td>
                          </tr>
                        `,
                          )
                          .join("")}

                      </table>

                      <!-- CTA -->
                      <div style="text-align:center;margin-top:24px;">
                        <a href="mailto:${email}" 
                          style="display:inline-block;padding:12px 20px;background:#2563eb;color:#ffffff;text-decoration:none;border-radius:8px;font-size:14px;font-weight:bold;">
                          Contactar cliente
                        </a>
                      </div>

                    </td>
                  </tr>

                  <!-- FOOTER -->
                  <tr>
                    <td style="padding:16px;text-align:center;font-size:12px;color:#9ca3af;">
                      CEDELO · Sistema de captación de leads<br/>
                      Este correo fue generado automáticamente
                    </td>
                  </tr>

                </table>

              </td>
            </tr>
          </table>
        </div>
        `,
    });

    return new Response(JSON.stringify({ ok: true }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Error en la API" }), {
      status: 500,
    });
  }
}
