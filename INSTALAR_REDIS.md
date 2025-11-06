# 🔴 COMO INSTALAR REDIS

## 🎯 PROBLEMA

Redis não está instalado e Homebrew precisa de permissões corretas.

---

## ✅ SOLUÇÃO

### **PASSO 1: Corrigir Permissões do Homebrew**

Copie e cole este comando no terminal (vai pedir sua senha):

```bash
sudo chown -R vini.mqs /opt/homebrew /Users/vini.mqs/Library/Caches/Homebrew /Users/vini.mqs/Library/Logs/Homebrew
```

### **PASSO 2: Instalar Redis**

```bash
brew install redis
```

### **PASSO 3: Iniciar Redis**

```bash
redis-server --daemonize yes
```

### **PASSO 4: Verificar se Redis está rodando**

```bash
redis-cli ping
```

Deve retornar: **PONG** ✅

---

## 🚀 COMANDO COMPLETO (COPIE E COLE TUDO)

```bash
# Corrigir permissões
sudo chown -R vini.mqs /opt/homebrew /Users/vini.mqs/Library/Caches/Homebrew /Users/vini.mqs/Library/Logs/Homebrew

# Instalar Redis
brew install redis

# Iniciar Redis
redis-server --daemonize yes

# Verificar
redis-cli ping
```

---

## ✅ DEPOIS DE INSTALAR

Execute novamente:

```bash
cd /Users/vini.mqs/Documents/tickrify_novo
./INICIAR_TUDO.sh
```

---

## 🎉 PRONTO!

Depois que Redis estiver instalado, a plataforma vai funcionar perfeitamente! 🚀

