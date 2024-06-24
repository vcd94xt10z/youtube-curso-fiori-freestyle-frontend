npm install

# instala as dependências
echo -------------------------------------------------------------------
echo [01/06] Dependencias
echo -------------------------------------------------------------------
npm install --save-dev @ui5/cli
npm install --save-dev nwabap-ui5uploader
npm install --save-dev ui5-test-runner

ui5 -v

# antes de executar, iniciar servidor com dados mock (no linux, coloque um & no final para rodar em background)
echo -------------------------------------------------------------------
echo [02/06] Subindo servidor Web em background para executar os testes
echo -------------------------------------------------------------------
ui5 serve --config ui5-mock.yaml --port 8085 &

# testes unitários
echo -------------------------------------------------------------------
echo [03/06] Executando testes unitários
echo -------------------------------------------------------------------
npx ui5-test-runner --url http://localhost:8085/test/unit/unitTests.qunit.html

# testes integrados
echo -------------------------------------------------------------------
echo [04/06] Executando testes integrados
echo -------------------------------------------------------------------
npx ui5-test-runner --url http://localhost:8085/test/integration/opaTests.qunit.html

# executar build
echo -------------------------------------------------------------------
echo [05/06] Executando build
echo -------------------------------------------------------------------
ui5 build

# deploy
echo -------------------------------------------------------------------
echo [06/06] Executando deploy
echo -------------------------------------------------------------------
npx nwabap upload