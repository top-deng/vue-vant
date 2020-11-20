const NAMESPACED = "myLoading"
const createLoadingPlugin = ({ namespaced = NAMESPACED } = {}) => {
  return store => {
    if (store.state[namespaced]) {
      throw new Error("createLoadingPlugin is exited");
    }
    store.registerModule(namespaced, {
        namespaced:true,
        state:{
          effect:{}
        },
        mutations:{
          show(state,payload){
            state.effect = {
              ...state.effect,
              [payload]:true   
            }
          },
          hide(state,payload){
            state.effect = {
              ...state.effect,
              [payload]:false   
            }    
          }
        }
      })
    // 核心代码
    // 也可以指定订阅处理函数的被调用时机应该在一个 action 分发之前还是之后 (默认行为是之前)
    // 订阅 store 的 action, 
    // handler 会在每个 action 分发的时候调用并接收 action 描述和当前的 store 的 state 这两个参数
    store.subscribeAction({
      // 调用action之后loading一直是true
      before: (action, state) => {
        console.log(`before action ${action.type}`)//before action oneAsync
        store.commit(namespaced+"/show",action.type)
      },
      after: (action, state) => {
        console.log(`after action ${action.type}`)//after action oneAsync
        store.commit(namespaced+"/hide",action.type)
      }
    })
  }
}
export default createLoadingPlugin