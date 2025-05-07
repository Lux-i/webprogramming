export const stateEvents = new EventTarget();
export var StateManager;
(function (StateManager) {
    let _token = null;
    let _currentUser = null;
    let _currentChat = null;
    const userMap = new Map();
    let TokenManager;
    (function (TokenManager) {
        function setToken(token) {
            _token = token;
            stateEvents.dispatchEvent(new CustomEvent("token"));
        }
        TokenManager.setToken = setToken;
        function getToken() {
            return _token;
        }
        TokenManager.getToken = getToken;
    })(TokenManager = StateManager.TokenManager || (StateManager.TokenManager = {}));
    let UserManager;
    (function (UserManager) {
        function setUser(user) {
            _currentUser = user;
            stateEvents.dispatchEvent(new CustomEvent("user"));
        }
        UserManager.setUser = setUser;
        function getUser() {
            return _currentUser;
        }
        UserManager.getUser = getUser;
    })(UserManager = StateManager.UserManager || (StateManager.UserManager = {}));
    let ChatManager;
    (function (ChatManager) {
        function setChatUser(user) {
            if (!user) {
                _currentChat = null;
                stateEvents.dispatchEvent(new CustomEvent("chat", { detail: null }));
            }
            else {
                _currentChat = { user, messages: [] };
                stateEvents.dispatchEvent(new CustomEvent("chat", { detail: user }));
            }
        }
        ChatManager.setChatUser = setChatUser;
        function getChatUser() {
            return (_currentChat === null || _currentChat === void 0 ? void 0 : _currentChat.user) || null;
        }
        ChatManager.getChatUser = getChatUser;
        function addMessage(message) {
            if (_currentChat) {
                _currentChat.messages = [..._currentChat.messages, message];
            }
            stateEvents.dispatchEvent(new CustomEvent("message"));
        }
        ChatManager.addMessage = addMessage;
        function addMessages(messages) {
            if (_currentChat) {
                _currentChat.messages = [..._currentChat.messages, ...messages];
                console.log(_currentChat.messages);
            }
            stateEvents.dispatchEvent(new CustomEvent("message"));
        }
        ChatManager.addMessages = addMessages;
        function clearMessages() {
            if (_currentChat) {
                _currentChat.messages = [];
            }
            stateEvents.dispatchEvent(new CustomEvent("message"));
        }
        ChatManager.clearMessages = clearMessages;
        function getMessages() {
            return (_currentChat === null || _currentChat === void 0 ? void 0 : _currentChat.messages) || null;
        }
        ChatManager.getMessages = getMessages;
    })(ChatManager = StateManager.ChatManager || (StateManager.ChatManager = {}));
    let UserRegistry;
    (function (UserRegistry) {
        function setUsers(users) {
            userMap.clear();
            users.forEach((user) => {
                userMap.set(user.id.toString(), user);
            });
            stateEvents.dispatchEvent(new CustomEvent("userreg"));
        }
        UserRegistry.setUsers = setUsers;
        function getUser(userId) {
            return userMap.get(userId) || null;
        }
        UserRegistry.getUser = getUser;
    })(UserRegistry = StateManager.UserRegistry || (StateManager.UserRegistry = {}));
})(StateManager || (StateManager = {}));
