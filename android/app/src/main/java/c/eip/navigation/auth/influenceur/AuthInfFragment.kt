package c.eip.navigation.auth.influenceur


import android.os.Bundle
import android.view.*
import android.widget.Button
import android.widget.ImageView
import androidx.fragment.app.Fragment
import androidx.navigation.fragment.findNavController
import c.eip.R

class AuthInfFragment : Fragment() {

    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        setHasOptionsMenu(true)
        return inflater.inflate(R.layout.fragment_auth_inf, container, false)
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)
        view.findViewById<ImageView>(R.id.chatIImg).setImageResource(R.drawable.chat_red)
        view.findViewById<ImageView>(R.id.shareImg).setImageResource(R.drawable.social_share_red)
        view.findViewById<ImageView>(R.id.followerImg).setImageResource(R.drawable.followers_red)
        view.findViewById<Button>(R.id.navigate_influenceur_login)?.setOnClickListener {
            findNavController().navigate(R.id.influenceur_login, null)
        }
        view.findViewById<Button>(R.id.navigate_influenceur_register)?.setOnClickListener {
            findNavController().navigate(R.id.influenceur_register, null)
        }
    }

    override fun onCreateOptionsMenu(menu: Menu, inflater: MenuInflater) {
        inflater.inflate(R.menu.main_menu, menu)
    }
}
