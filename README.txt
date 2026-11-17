MEU BANCO DE HORAS AI — VERSÃO 1.0

CONTEÚDO
- PWA instalável no Android.
- Cálculo diário por entrada, saída e jornada prevista.
- Histórico local, edição, exclusão e backup JSON.
- Seleção de fotografia de comprovante (OCR automático ainda não integrado).

CONFIGURAÇÃO PADRÃO
- Segunda a sexta.
- Entrada de referência: 06:30.
- Saída de referência: 16:48.
- Jornada prevista: 8 horas (480 minutos).
- Pausas: 7 min manhã + 7 min tarde, já incluídas; não são descontadas.

IMPORTANTE SOBRE O CÁLCULO
A primeira versão calcula o tempo decorrido entre entrada e saída e compara com a jornada prevista. Como as pausas são incluídas na jornada, não há desconto adicional. A interpretação de horas extras/compensação deve ser confirmada com o acordo da empresa/RH. O app não valida feriados, faltas, tolerâncias legais, adicionais ou regras coletivas.

COMO TESTAR
1. Hospede os arquivos em um serviço de hospedagem estática HTTPS (por exemplo, GitHub Pages).
2. Abra o endereço HTTPS no Chrome do Android.
3. Use o menu do Chrome > Instalar app ou Adicionar à tela inicial.
4. Cadastre um dia de teste. Exemplo: 06:30 a 16:48, jornada 8 horas = saldo matemático +02h18.
5. Use Exportar backup regularmente.

PRIVACIDADE
Os registros ficam no armazenamento local do navegador deste aparelho. Limpar os dados do navegador pode apagá-los. Exporte backups para preservar seus registros. A foto escolhida não é enviada a um servidor por este protótipo.
