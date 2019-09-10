package c.eip.navigation.auth.shop


import android.os.Bundle
import android.view.*
import android.widget.Button
import android.widget.ImageView
import androidx.fragment.app.Fragment
import androidx.navigation.fragment.findNavController
import c.eip.R

class AuthShopFragment : Fragment() {

    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        setHasOptionsMenu(true)
        return inflater.inflate(R.layout.fragment_auth_shop, container, false)
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)

        view.findViewById<ImageView>(R.id.chatSImg).setImageResource(R.drawable.chat)
        view.findViewById<ImageView>(R.id.deliveryImg).setImageResource(R.drawable.delivery)
        view.findViewById<ImageView>(R.id.queueImg).setImageResource(R.drawable.queue)
        view.findViewById<Button>(R.id.navigate_shop_login)?.setOnClickListener {
            findNavController().navigate(R.id.shop_login, null);
        }
        view.findViewById<Button>(R.id.navigate_shop_register)?.setOnClickListener {
            findNavController().navigate(R.id.shop_register, null);
        }
    }

    override fun onCreateOptionsMenu(menu: Menu, inflater: MenuInflater) {
        inflater.inflate(R.menu.main_menu, menu)
    }
}
