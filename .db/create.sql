CREATE TABLE aviao (
  id SERIAL PRIMARY KEY,
  capacidade INT NOT NULL,
  modelo CHAR(128) NOT NULL
);

CREATE TABLE portao (
  id SERIAL PRIMARY KEY,
  ocupado BOOLEAN NOT NULL
);

CREATE TABLE Guiche (
  id SERIAL PRIMARY KEY
);

CREATE TABLE companhia (
  cnpj VARCHAR(18) PRIMARY KEY,
  nome CHAR(128) NOT NULL,
  paisOrigem CHAR(128) NOT NULL,
  descricao CHAR(128)
);

CREATE TABLE voo (
  id SERIAL PRIMARY KEY,
  partida TIMESTAMP NOT NULL,
  chegada TIMESTAMP NOT NULL,
  localPartida CHAR(512) NOT NULL,
  localChegada CHAR(512) NOT NULL,
  aviaoID  INT NOT NULL,
  CONSTRAINT fk_aviao
  	FOREIGN KEY(aviaoID)
  		REFERENCES aviao (id),
  portaoID INT NOT NULL,
  CONSTRAINT fk_portao
  	FOREIGN KEY(portaoID)
  		REFERENCES portao (id),
  companhiaCNPJ CHAR(512) NOT NULL,
  CONSTRAINT fk_companhia
  	FOREIGN KEY(companhiaCNPJ)
  		REFERENCES companhia (cnpj)
);



CREATE TABLE funcionario (
  cpf VARCHAR(14) PRIMARY KEY,
  dataNascimento DATE NOT NULL,
  nome CHAR(128) NOT NULL,
  telefone CHAR(128) NOT NULL,
  rg CHAR(12) NOT NULL,
  email CHAR(128),
  salario FLOAT NOT NULL
);


CREATE TABLE atendente (
  funcCPF VARCHAR PRIMARY KEY,
  CONSTRAINT fk_funcionario
   	FOREIGN key(funcCPF)
   		REFERENCES funcionario (cpf)
   		ON DELETE CASCADE,
  turno VARCHAR(32) NOT NULL
);


CREATE TABLE comissarioDeBordo (
  funcCPF VARCHAR PRIMARY KEY,
  CONSTRAINT fk_funcionario
   	FOREIGN key(funcCPF)
   		REFERENCES funcionario (cpf)
   		ON DELETE CASCADE
);


CREATE TABLE piloto (
  funcCPF VARCHAR PRIMARY KEY,
  CONSTRAINT fk_funcionario
  	FOREIGN KEY(funcCPF)
   		REFERENCES funcionario (cpf)
   		ON DELETE CASCADE
);


CREATE TABLE passageiro (
  cpf VARCHAR(14) PRIMARY KEY,
  rg CHAR(12) NOT NULL,
  telefone CHAR(128) NOT NULL,
  email CHAR(128),
  nome CHAR(128) NOT NULL
);


CREATE TABLE bagagem (
  id SERIAL PRIMARY KEY,
  peso FLOAT NOT NULL,
  esteira INT NOT NULL,
  cpf VARCHAR NOT NULL ,
  CONSTRAINT fk_passageiro
  	FOREIGN KEY(cpf)
  		REFERENCES passageiro (cpf)
  		ON DELETE CASCADE
);


CREATE TABLE bagagemExtraviada (
  bagId INT PRIMARY KEY,
  CONSTRAINT fk_bagagem
  	FOREIGN KEY(bagId)
  		REFERENCES bagagem (id)
  		ON DELETE CASCADE,
  vooId INT NOT NULL,
  CONSTRAINT fk_voo
  	FOREIGN KEY(vooId)
  		REFERENCES voo (id)
);


CREATE TABLE voaNo (
  vooId INT,
  CONSTRAINT fk_voo
  	FOREIGN KEY(vooId)
  		REFERENCES voo (id)
  		ON DELETE CASCADE,
  cpf VARCHAR,
  CONSTRAINT fk_passageiro
  	FOREIGN KEY(cpf)
  		REFERENCES passageiro (cpf)
  		ON DELETE CASCADE,
  PRIMARY KEY(vooId, cpf)
);


CREATE TABLE atuaNo (
  vooId INT,
  CONSTRAINT fk_voo
  	FOREIGN KEY(vooId)
  		REFERENCES voo (id)
  		ON DELETE CASCADE,
  funcCPF VARCHAR,
  CONSTRAINT fk_comissarioDeBordo
  	FOREIGN KEY(funcCPF)
  		REFERENCES comissarioDeBordo (funcCPF)
  		ON DELETE CASCADE,
  PRIMARY KEY(vooId, funcCPF)
);


CREATE TABLE pilotaNo (
  vooId INT,
  CONSTRAINT fk_voo
  	FOREIGN KEY(vooId)
  		REFERENCES voo (id)
  		ON DELETE CASCADE,
  funcCPF VARCHAR,
  CONSTRAINT fk_piloto
  	FOREIGN KEY(funcCPF)
  		REFERENCES piloto (funcCPF)
  		ON DELETE CASCADE,
  PRIMARY KEY(vooId, funcCPF)
);


CREATE TABLE recpecionaNo (
  guicheId INT,
  CONSTRAINT fk_guiche
  	FOREIGN KEY(guicheId)
  		REFERENCES guiche (id)
  		ON DELETE CASCADE,
  funcCPF VARCHAR,
  CONSTRAINT fk_atendente
  	FOREIGN KEY(funcCPF)
  		REFERENCES atendente (funcCPF)
  		ON DELETE CASCADE,
  PRIMARY KEY(guicheId, funcCPF)
);

CREATE TABLE atendeNo (
  portaoId INT,
  CONSTRAINT fk_portao
  	FOREIGN KEY(portaoId)
  		REFERENCES portao (id)
  		ON DELETE CASCADE,
  funcCPF VARCHAR,
  CONSTRAINT fk_atendente
  	FOREIGN KEY(funcCPF)
  		REFERENCES atendente (funcCPF)
  		ON DELETE CASCADE,
  PRIMARY KEY(portaoId, funcCPF)
);