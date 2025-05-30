const form = document.getElementById('formulario');
const mensagem = document.getElementById('mensagem');
const senhaInput = document.getElementById('senha');
const confirmarSenhaInput = document.getElementById('confirmarSenha');
const toggleSenha = document.getElementById('toggleSenha');
const forcaSenha = document.getElementById('forcaSenha');

// Mostrar/ocultar senha
toggleSenha.addEventListener('click', () => {
  const type = senhaInput.type === 'password' ? 'text' : 'password';
  senhaInput.type = type;
  confirmarSenhaInput.type = type;
  toggleSenha.classList.toggle('fa-eye-slash');
});

// Validação e feedback
form.addEventListener('submit', function (e) {
  e.preventDefault();

  const senha = senhaInput.value;
  const confirmarSenha = confirmarSenhaInput.value;

  if (senha.length < 6) {
    alert('A senha precisa ter pelo menos 6 caracteres!');
    return;
  }

  if (senha !== confirmarSenha) {
    alert('As senhas não coincidem!');
    return;
  }

  mensagem.textContent = 'Cadastro realizado com sucesso!';
  mensagem.style.display = 'block';
  form.reset();
  forcaSenha.style.backgroundColor = '#eee';
});

// Medidor de força da senha
senhaInput.addEventListener('input', () => {
  const senha = senhaInput.value;
  let cor = '#ccc';

  if (senha.length >= 6 && /[A-Z]/.test(senha) && /[0-9]/.test(senha)) {
    cor = '#0f0'; // forte
  } else if (senha.length >= 6) {
    cor = '#ff0'; // média
  } else {
    cor = '#f00'; // fraca
  }

  forcaSenha.style.backgroundColor = cor;
});
