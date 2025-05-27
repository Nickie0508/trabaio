document.getElementById("formCadastro").addEventListener("submit", function(event) {
  event.preventDefault(); // evita envio padrão

  // Exibe mensagem de sucesso
  const mensagem = document.getElementById("mensagem");
  mensagem.style.display = "block";

  // Aguarda 2 segundos e redireciona
  setTimeout(() => {
    window.location.href = "calendario.html";
  }, 2000);
});