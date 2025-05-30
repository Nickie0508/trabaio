// Seletores principais
const form = document.getElementById('formulario');
const mensagem = document.getElementById('mensagem');
const senhaInput = document.getElementById('senha');
const confirmaSenhaInput = document.getElementById('confirmaSenha');
const forca = document.getElementById('forca');

// Dark Mode Toggle
const toggle = document.getElementById("darkModeToggle");
toggle.addEventListener("change", () => {
  document.body.classList.toggle("dark");
});

// Mostrar/Ocultar Senha
function togglePassword(id) {
  const input = document.getElementById(id);
  input.type = input.type === "password" ? "text" : "password";
}

// Medidor de força da senha
senhaInput.addEventListener("input", () => {
  const val = senhaInput.value;
  let strength = 0;
  if (val.length >= 8) strength++;
  if (/[A-Z]/.test(val)) strength++;
  if (/[0-9]/.test(val)) strength++;
  if (/[\W]/.test(val)) strength++;

  const texto = ["Fraca", "Média", "Boa", "Forte"];
  const cores = ["#e74c3c", "#f1c40f", "#27ae60", "#2ecc71"];
  forca.textContent = texto[strength - 1] || "";
  forca.style.color = cores[strength - 1] || "#ccc";
});

// Validação de envio do formulário
form.addEventListener('submit', function (e) {
  e.preventDefault();

  const senha = senhaInput.value;
  const confirmaSenha = confirmaSenhaInput.value;

  if (senha.length < 6) {
    alert('A senha precisa ter pelo menos 6 caracteres!');
    return;
  }

  if (senha !== confirmaSenha) {
    alert('As senhas não coincidem!');
    return;
  }

  mensagem.textContent = 'Cadastro realizado com sucesso!';
  mensagem.style.display = 'block';
  mensagem.style.color = 'green';
  form.reset();
  forca.textContent = ''; // limpa o medidor após envio
});
