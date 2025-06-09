import AuthForm from "../components/AuthForm";
import { redirect } from "react-router-dom";

function AuthenticationPage() {
  return <AuthForm />;
}

export default AuthenticationPage;

export async function action({ request }) {
  const searchParams = new URL(request.url).searchParams;
  const mode = searchParams.get("mode") || "login"; // login by default

  // Kullanici kendisi bir mode yazarsa url'ye diye

  if (mode !== "login" && mode !== "signup") {
    throw new Response("Invalid mode. Must be login or signup", {
      status: 422,
    });
  }

  const data = await request.formData();

  const authData = {
    email: data.get("email"),
    password: data.get("password"),
  };

  const response = await fetch(`http://localhost:8080/${mode}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json", // Sunucuya "JSON verisi gönderiyorum" diyor, Sunucu bunu okuyup JSON olarak parse edebilir
    },
    body: JSON.stringify(authData),
  });

  if (response.status === 422 || response.status === 401) {
    console.log("422/401 hatasi");
    return response; // 422/401 → Kullanıcı Hatası (Beklenen) - Hata mesajını kullanıcıya göster
  }

  if (!response.ok){
    console.log("Diğer hata:", response.status);
    throw new Response("Could NOT authenticate user.", {
      status: response.status,
    }); // Diğer Hatalar → Sistem Hatası (Beklenmedik)
  }

  // manage token
  const resData = await response.json(); // JavaScript object'e çevirir
  const token = resData.token;

  localStorage.setItem('token', token);
  const expiration = new Date();
  expiration.setHours(expiration.getHours() + 1);
  localStorage.setItem('expiration', expiration.toISOString());


  // İşlem başarılı → redirect('/') 
  return redirect('/');
}
