const form = document.getElementById('formulario');
const senhaInput = document.getElementById('senha');
const confirmarSenhaInput = document.getElementById('confirmarSenha');
const mensagem = document.getElementById('mensagem');
const forcaSenha = document.getElementById('forcaSenha');

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

  mensagem.style.display = 'block';
  mensagem.innerText = 'Cadastro realizado com sucesso!';
  form.reset();
  forcaSenha.className = '';
});

senhaInput.addEventListener('input', () => {
  const val = senhaInput.value;
  let nivel = '';
  if (val.length < 6) {
    nivel = 'fraca';
  } else if (val.match(/[A-Z]/) && val.match(/[0-9]/) && val.match(/[@$!%*?&#]/)) {
    nivel = 'forte';
  } else {
    nivel = 'media';
  }

  forcaSenha.className = nivel;
});

function toggleSenha(id, el) {
  const input = document.getElementById(id);
  const tipo = input.getAttribute('type') === 'password' ? 'text' : 'password';
  input.setAttribute('type', tipo);
  el.classList.toggle('fa-eye-slash');
}
