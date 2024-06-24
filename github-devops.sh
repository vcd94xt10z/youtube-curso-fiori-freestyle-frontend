# instala as dependências
echo Dependencias
npm install --global @ui5/cli
npm install --global ui5-test-runner

# antes de executar, iniciar servidor com dados mock (no linux, coloque um & no final para rodar em background)
ui5 serve --config ui5-mock.yaml --port 8080 &

# testes unitários
npx ui5-test-runner --url http://localhost:8080/test/unit/unitTests.qunit.html

# testes integrados
npx ui5-test-runner --url http://localhost:8080/test/integration/opaTests.qunit.html

# executar build
ui5 build

# deploy
npx nwabap upload